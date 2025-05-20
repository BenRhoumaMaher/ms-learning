<?php

declare(strict_types=1);

use PhpCsFixer\Fixer\Operator\ConcatSpaceFixer;
use Symplify\EasyCodingStandard\Config\ECSConfig;
use Symplify\EasyCodingStandard\ValueObject\Set\SetList;

return static function (ECSConfig $ecsConfig): void {
    $ecsConfig->paths(
        [
        __DIR__ . '/src',
        __DIR__ . '/tests'
        ]
    );

    $ecsConfig->sets(
        [
        SetList::PSR_12,
        SetList::COMMON,
        SetList::CLEAN_CODE,
        ]
    );

    $ecsConfig->skip(
        [
        ConcatSpaceFixer::class,
        ]
    );
};
